| File                          | Work                                      | Use                               |
| ----------------------------- | ----------------------------------------- | --------------------------------- |
| `server.js`                   | Starts server and connects MongoDB        | Entry point of backend            |
| `app.js`                      | Configures Express, middleware and routes | Central application configuration |
| `Users.js`                    | Defines user schema                       | Stores users in MongoDB           |
| `Farm.js`                     | Defines farm schema                       | Stores farmer/farm information    |
| `authMiddleware.js`           | Verifies JWT                              | Protects private APIs             |
| `roleMiddleware.js`           | Checks user role                          | Admin/expert access control       |
| `checkFarmOwnership.js`       | Checks farm belongs to logged-in farmer   | Prevents unauthorized farm access |
| `validateMiddleware.js`       | Runs Joi validation                       | Rejects invalid requests          |
| `rateLimiter.js`              | Limits login attempts                     | Prevents brute-force attacks      |
| `errorMiddleware.js`          | Handles errors centrally                  | Consistent error responses        |
| `notFound.js`                 | Handles unknown routes                    | Returns 404                       |
| `UserController.js`           | Register/login/get users                  | User business logic               |
| `FarmController.js`           | Create/get farms                          | Farm business logic               |
| `SoilController.js`           | Save/get soil data                        | Soil management                   |
| `WeatherController.js`        | Save/get weather data                     | Weather management                |
| `RecommendationController.js` | Handles recommendations                   | AI/ML recommendation system       |
| `AlertsController.js`         | Creates/gets/deletes alerts               | Farmer notification system        |
| `farmValidation.js`           | Validates farm data                       | Input security                    |
| `soilValidation.js`           | Validates soil data                       | Input security                    |
| `userValidation.js`           | Validates registration/login              | Input security                    |
| `weatherValidation.js`        | Validates weather data                    | Input security                    |
| `recommendationValidation.js` | Validates recommendation data             | Input security                    |
| `userRoutes.js`               | Defines user endpoints                    | Connects URLs to controllers      |
| `farmRoutes.js`               | Defines farm endpoints                    | Farm API                          |
| `soilRoutes.js`               | Defines soil endpoints                    | Soil API                          |
| `weatherRoutes.js`            | Defines weather endpoints                 | Weather API                       |
| `recommendationRoutes.js`     | Defines recommendation endpoints          | AI API                            |
| `AlertsRoutes.js`             | Defines alert endpoints                   | Alert API                         |
| `marketPrice.js`              | Defines market-price endpoints            | Crop market information           |
| `cropsRoutes.js`              | Defines crop endpoints                    | Crop information                  |
