const mod = require("../db/model");

module.exports = {
  /**
   * It check if user has initiated the application,
   * it initiate new one if there is no any.
   * @param indexNo the id of the user who want to initiate application.
   * @param data Is the minimum information for initiating application.
   * @return application created.
   */
  initApplication: async (indexNo, data) => {
    const thisYear = new Date(Date.now()).getFullYear();
    try {
      const app = await mod.Application.findOne({
        indexNo: indexNo,
        year: thisYear,
      });

      if (app) {
        // console.log(app);
        return app;
      }

      if (!app && app !== null) {
        throw new Error("Error fetching application");
      } else {
        // create one
        data.indexNo = "S1298.0245.2014";
        let application = new mod.Application(data);
        application = await application.save();
        return application;
      }
    } catch (err) {
      console.log(err);
    }
  },
};
