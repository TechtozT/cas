const { unpackDoc } = require("../helpers/helper");

module.exports = {
  create: async (model, data) => {
    const newEntity = new model(data);
    try {
      newEntity = await newEntity.save();
      if (!newEntity)
        throw new Error(`Failed to create, please try again`);
      return unpackDoc(newEntity);
    } catch (err) {
      throw err;
    }
  },

  get: async (model, options, projection) => {
    try {
      const result = await model.find(options, projection);
      if (!result)
        throw new Error("Failed to fetch, please try again");
      return unpackDoc(result);
    } catch (err) {
      throw err;
    }
  },

  remove: async (model, ids) => {
    // Remove is done by ID's
    try {
      const result = await model.remove({_id: {$in: ids}});
      if (!result) throw new Error("Failed to remove, please try again");
      return unpackDoc(result);
    } catch (err) {
      throw err;
    }
  },

  update: async (model, ids, update) => {
    // Updates is done by ID's
    try {
      const result = await model.updateMany({_id: {$in: ids}}, update);
      if (!result) throw new Error("Failed to update, please again");
      return unpackDoc(result);
    } catch (err) {
      throw err;
    }
  },
};
