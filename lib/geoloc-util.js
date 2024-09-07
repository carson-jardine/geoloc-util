const { multipleLocationSearch } = require('./geoloc-util-helper');

async function commandLineUtility() {
    const args = process.argv.slice(2); // Remove node and script path from the arguments

    if (args.length === 0) {
        console.error('No locations provided. Usage: geoloc-util "City, State" "ZipCode" ...');
        process.exit(1);
    }

    await multipleLocationSearch(args)
    .then(results => {
        results.forEach(result => {
            console.log(`Location: ${result.name}, Latitude: ${result.lat}, Longitude: ${result.lon}`); 
        });
    })
    .catch((err) => {
        console.error(err.message);
        process.exit(2)
    });
}

// Runs the utility only if this script is executed directly
if (require.main === module) {
    commandLineUtility();
}

module.exports = { commandLineUtility }