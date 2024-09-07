const { commandLineUtility } = require('../lib/geoloc-util');
const { multipleLocationSearch } = require('../lib/geoloc-util-helper');

jest.mock('../lib/geoloc-util-helper', () => ({
    multipleLocationSearch: jest.fn(),
}));

describe('commandLineUtility Tests', () => {
    let originalArgv;
    // let originalMain;
    let consoleLogMock;
    let consoleErrorMock;
    let processExitMock;

    beforeEach(() => {
        originalArgv = process.argv;
        // originalMain = require.main;
        consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
        processExitMock = jest.spyOn(process, 'exit').mockImplementation(() => {});
        jest.clearAllMocks();
    });

    afterEach(() => {
        process.argv = originalArgv;
        // require.main = originalMain;
        consoleLogMock.mockRestore();
        consoleErrorMock.mockRestore();
        processExitMock.mockRestore();
    });

    test('it should fetch data from valid command line input', async () => {
        process.argv = ['node', 'script.js', 'Madison, WI', '90210'];

        const mockResults = [
            { name: 'Madison', lat: 43.0731, lon: -89.4012 },
            { name: 'Beverly Hills', lat: 34.0736, lon: -118.4004 }
        ];
        multipleLocationSearch.mockResolvedValue(mockResults);

        await commandLineUtility();

        expect(multipleLocationSearch).toHaveBeenCalledWith(['Madison, WI', '90210']);
        expect(consoleLogMock).toHaveBeenCalledWith('Location: Madison, Latitude: 43.0731, Longitude: -89.4012');
        expect(consoleLogMock).toHaveBeenCalledWith('Location: Beverly Hills, Latitude: 34.0736, Longitude: -118.4004');
    });

    test('it should log an error and exit with code 1 when no arguments are provided', () => {
        process.argv = ['node', 'script.js'];

        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
        const processExitMock = jest.spyOn(process, 'exit').mockImplementation(() => {});

        commandLineUtility();

        expect(consoleErrorMock).toHaveBeenCalledWith('No locations provided. Usage: geoloc-util "City, State" "ZipCode" ...');
        expect(processExitMock).toHaveBeenCalledWith(1);
    });

    test('should log an error and exit with code 2 when an error occurs', async () => {
        process.argv = ['node', 'script.js', 'Madison, WI', '90210'];

        const mockError = new Error('Something went wrong');
        multipleLocationSearch.mockRejectedValue(mockError);

        await commandLineUtility();

        expect(consoleErrorMock).toHaveBeenCalledWith('Something went wrong');
        expect(processExitMock).toHaveBeenCalledWith(2);
    });

    // Please see Project Reflection section of README for more information on commented out code.
    // test('it should invoke commandLineUtility when the script is executed directly', () => {
    //     const commandLineUtilitySpy = jest.spyOn(require('../lib/geoloc-util'), 'commandLineUtility');
        
    //     require.main = module;

    //     jest.isolateModules(() => {
    //         require('../lib/geoloc-util');  // This should trigger commandLineUtility
    //     });

    //     expect(commandLineUtilitySpy).toHaveBeenCalled();
    // });

    // test('it should not invoke commandLineUtility when the script is imported', () => {
    //     const commandLineUtilitySpy = jest.spyOn(require('../lib/geoloc-util'), 'commandLineUtility');

    //     require.main = {};

    //     jest.isolateModules(() => {
    //         require('../lib/geoloc-util');  // This should NOT trigger commandLineUtility
    //     });

    //     expect(commandLineUtilitySpy).not.toHaveBeenCalled();
    // });
});