const yargs = require('yargs');
const ltaApi = require('./lta-api');

yargs
  .command({
    command: 'bus-arrival',
    describe: 'Get bus arrival information',
    builder: {
      busStopCode: {
        describe: 'Bus Stop Code',
        demandOption: true,
        type: 'string',
      },
      serviceNo: {
        describe: 'Service Number',
        demandOption: true,
        type: 'string',
      },
    },
    handler: async (argv) => {
      try {
        const busArrival = await ltaApi.getBusArrival(argv.busStopCode, argv.serviceNo);
        const nextBus = busArrival.Services[0].NextBus;
        const nextBus2 = busArrival.Services[0].NextBus2;

        console.log(`Bus Service No: ${argv.serviceNo}`);
        console.log(`Bus Stop Code: ${argv.busStopCode}`);

        if (nextBus.EstimatedArrival) {
          const arrivalTime = new Date(nextBus.EstimatedArrival);
          console.log(`Next Bus Arrival: ${arrivalTime.toLocaleString()}`);
        } else {
          console.log('Next Bus Arrival: Not available');
        }

        if (nextBus2.EstimatedArrival) {
          const arrivalTime2 = new Date(nextBus2.EstimatedArrival);
          console.log(`Next Bus 2 Arrival: ${arrivalTime2.toLocaleString()}`);
        } else {
          console.log('Next Bus 2 Arrival: Not available');
        }
      } catch (error) {
        console.error('Error fetching bus arrival:', error);
      }
    },
  })
  .command({
    command: 'parking-availability',
    describe: 'Get parking availability information',
    handler: async () => {
      try {
        const parkingAvailability = await ltaApi.getParkingAvailability();
        console.log('Parking Availability:', parkingAvailability);
      } catch (error) {
        console.error('Error fetching parking availability:', error);
      }
    },
  })
  .command({
    command: 'bus-travel-time',
    describe: 'Estimate travel time between two bus stops',
    builder: {
      fromBusStopCode: {
        describe: 'From Bus Stop Code',
        demandOption: true,
        type: 'string',
      },
      toBusStopCode: {
        describe: 'To Bus Stop Code',
        demandOption: true,
        type: 'string',
      },
    },
    handler: async (argv) => {
      try {
        const busRoutes = await ltaApi.getBusRoutes();
        const fromBusStopRoutes = busRoutes.filter(route => route.BusStopCode === argv.fromBusStopCode);
        const toBusStopRoutes = busRoutes.filter(route => route.BusStopCode === argv.toBusStopCode);

        const commonServiceRoutes = fromBusStopRoutes.filter(fromRoute => 
          toBusStopRoutes.some(toRoute => fromRoute.ServiceNo === toRoute.ServiceNo)
        );

        if (commonServiceRoutes.length === 0) {
          console.log('No direct bus service found between the two bus stops.');
          return;
        }

        const travelTimes = commonServiceRoutes.map(route => {
          const toRoute = toBusStopRoutes.find(r => r.ServiceNo === route.ServiceNo);
          const distance = Math.abs(route.Distance - toRoute.Distance);
          const estimatedTime = distance / 0.5; // Assuming average bus speed of 0.5 km/min
          return {
            serviceNo: route.ServiceNo,
            distance: distance,
            estimatedTime: estimatedTime,
          };
        });

        console.log(`Travel time between bus stops ${argv.fromBusStopCode} and ${argv.toBusStopCode}:`);
        travelTimes.forEach(time => {
          console.log(`Bus Service No: ${time.serviceNo}`);
          console.log(`Estimated Time: ${time.estimatedTime.toFixed(2)} minutes`);
          console.log('');
        });
      } catch (error) {
        console.error('Error estimating travel time between bus stops:', error);
      }
    },
  })
  .command({
    command: 'nearest-bus-stops',
    describe: 'Find the nearest bus stops based on latitude and longitude',
    builder: {
      latitude: {
        describe: 'Latitude',
        demandOption: true,
        type: 'number',
      },
      longitude: {
        describe: 'Longitude',
        demandOption: true,
        type: 'number',
      },
      limit: {
        describe: 'Number of nearest bus stops to display',
        type: 'number',
        default: 5,
      },
    },
    handler: async (argv) => {
      try {
        const nearestBusStops = await ltaApi.getNearestBusStops(argv.latitude, argv.longitude, argv.limit);
        console.log('Nearest Bus Stops:', nearestBusStops);
      } catch (error) {
        console.error('Error fetching nearest bus stops:', error);
      }
    },
  })
  .demandCommand(1, 'You must provide a valid command.')
  .help()
  .alias('h', 'help')
  .strict()
  .parse();
