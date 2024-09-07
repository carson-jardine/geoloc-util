const { checkApiKey, getLocationByCity,  getLocationByZipcode, multipleLocationSearch} = require('../lib/geoloc-util-helper');

jest.mock('../lib/geoloc-util-helper', () => ({
        ...jest.requireActual('../lib/geoloc-util-helper'),
        checkApiKey: jest.fn(),
    }));

describe('Geolocation Integration Tests', () => {
    test('it should fetch location data by city and state', async () => {
        const city = 'Madison';
        const state = 'WI';

        const result = await getLocationByCity(city, state);
        
        expect(result).toBeDefined();
        expect(result.name).toBe('Madison');
        expect(result.state).toBe('Wisconsin');
        expect(result).toHaveProperty('lat');
        expect(result).toHaveProperty('lon');
    });

    test('it should fetch location data by zipcode', async () => {
        const zipcode = '90210'

        const result = await getLocationByZipcode(zipcode);

        expect(result).toBeDefined();
        expect(result.name).toBe('Beverly Hills');
        expect(result).toHaveProperty('lat');
        expect(result).toHaveProperty('lon');
    });

    describe('multipleLocationSearch Tests', () => {
        test('it should fetch data for multiple locations', async () => {
            const locations = ['Madison, WI', '90210', 'Denver, co'];

            const results = await multipleLocationSearch(locations)
            
            expect(results.length).toBe(3);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Madison',
                        lat: expect.any(Number),
                        lon: expect.any(Number),
                    }),
                    expect.objectContaining({
                        name: 'Beverly Hills',
                        lat: expect.any(Number),
                        lon: expect.any(Number),
                    }),
                    expect.objectContaining({
                        name: 'Denver',
                        lat: expect.any(Number),
                        lon: expect.any(Number),
                    })
                ])
            )
        });

        test('it should return partial results for mixed valid and invalid inputs locations', async () => {
            const locations = ['Madison, WI', 'Invalid, NY', '00001'];

            const results = await multipleLocationSearch(locations)
            
            expect(results.length).toBeGreaterThan(0);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Madison',
                        lat: expect.any(Number),
                        lon: expect.any(Number),
                    }),
                ])
            );
        });

        test('it should throw error when input is invalid', async () => {
            const locations = ['Invalid, WI', 'a42f2', 'Another Invalid, Place', '11111']

            // captures error output for validation
            const logSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});

            await multipleLocationSearch(locations)
            
            expect(logSpy).toHaveBeenCalledTimes(4);
            expect(logSpy.mock.calls).toEqual(
                expect.arrayContaining([
                    expect.arrayContaining([
                        'Invalid location format: a42f2'
                    ]),
                    expect.arrayContaining([
                        'Invalid location format: Another Invalid, Place'
                    ]),
                    expect.arrayContaining([
                        'Error fetching data for zipcode: 11111 - Request failed with status code 404'
                    ]),
                    expect.arrayContaining([
                        'Error fetching data for city/state input: Invalid, WI - No location found for city/state: Invalid, WI'
                    ]),
                ])
            );
        });
    });
    describe('API Key Check', () => {   
        test('it should throw an error if the API key is missing', async () => {
            delete process.env.OPENWEATHER_API_KEY;

            checkApiKey.mockImplementation(() => {
                throw new Error('API key is missing. Please set the OPENWEATHER_API_KEY in the environment variables.');
            });

            await expect(getLocationByCity('Madison', 'WI')).rejects.toThrow(
                'API key is missing. Please set the OPENWEATHER_API_KEY in the environment variables.'
            );
        });
        
    });
});