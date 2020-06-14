exports.hasProperties = (arg) => {
  if (Object.values(arg).length === 0) {
    throw new Error("Please pass in some options");
  }
};

exports.isValidEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

exports.unpackDoc = (doc) => {
  return {
    ...doc._doc,
    _id: doc.id,
  };
};
