import Validator from "fastest-validator";
import validator from "validator";
import User from "../models/user.js";

export const validateRegBody = async (req, res, next) => {
  const { body } = req;
  if (!body.name || body.name === "") {
    return res
      .status(406)
      .json({ msg: "Name is required & should not be empty!" });
  }
  if (!body.email || body.email === "") {
    return res
      .status(406)
      .json({ msg: "Email is required & should not be empty!" });
  }
  const email = await User.findOne({ email: body.email });
  if (email) {
    return res.status(409).json({ msg: "Email is already present!" });
  }
  const roleOptions = ["delivery", "restaurant", "admin", "customer"];

  if (!body.role || !roleOptions.find((role) => role === body.role)) {
    return res.status(406).json({
      msg: "Role is required & should be one of valid options!",
      options: roleOptions,
    });
  }

  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

  if (!body.password || !re.test(body.password)) {
    return res.status(406).json({
      msg: "Password should consist of minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character !",
    });
  }
  next();
};

export const validateLoginBody = async (req, res, next) => {
  const { body } = req;
  if (!body.email || body.email === "") {
    return res
      .status(400)
      .json({ msg: "Email is required & should not be empty!" });
  }
  const roleOptions = ["delivery", "restaurant", "admin", "customer"];

  if (!body.role || !roleOptions.find((role) => role === body.role)) {
    return res.status(400).json({
      msg: "Role is required & should be one of valid options!",
      options: roleOptions,
    });
  }

  if (!body.password || body.password === "") {
    return res.status(400).json({
      msg: "Password should not be empty!",
    });
  }
  next();
};

export const validateRestaurantRegisterBody = async (req, res, next) => {
  const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: {
      phoneNumber: "Not a valid 10 digit phone number",
      latitude: "latitude must be between -90 to 90",
      longitude: "longitude must be between -180 to 180",
    },
  });
  const schema = {
    name: {
      type: "string",
      min: 3,
      max: 100,
    },
    address: {
      type: "string",
    },
    latitude: {
      type: "any",
      custom: (val, errors) => {
        const lat = parseFloat(val);
        if (val < -90.0 || val > 90.0) {
          errors.push({ type: "latitude" });
        }
        return val;
      },
    },
    longitude: {
      type: "any",
      custom: (val, errors) => {
        const lat = parseFloat(val);
        if (val < -180.0 || val > 180.0) {
          errors.push({ type: "longitude" });
        }
        return val;
      },
    },
    ownerEmail: {
      type: "email",
    },
    invoicingEmail: {
      type: "email",
    },
    ownerPhone: {
      type: "string",
      length: 10,
      custom: (val, errors) => {
        if (!validator.isMobilePhone(val, ["en-IN"])) {
          errors.push({ type: "phoneNumber" });
        }
        return val;
      },
    },
    managerPhone: {
      type: "string",
      length: 10,
      custom: (val, errors) => {
        if (!validator.isMobilePhone(val, ["en-IN"])) {
          errors.push({ type: "phoneNumber" });
        }
        return val;
      },
    },
    whatsapp: {
      type: "string",
      custom: (val, errors) => {
        if (!validator.isMobilePhone(val)) {
          errors.push({ type: "phoneNumber" });
        }
        return val;
      },
    },
    bankac: {
      type: "string",
    },
    ifsc: {
      type: "string",
    },
    openingTime: {
      type: "string",
    },
    closingTime: {
      type: "string",
    },
  };
  const check = v.compile(schema);
  const checked = check(req.body);
  if (checked === true) {
    next();
  } else {
    res.status(400).json(checked);
  }
};

export const validateRestaurantUpdateBody = async (req, res, next) => {
  const { id } = req.params;
  if (!validator.isMongoId(id)) {
    return res.status(400).json({ msg: "Invalid MongoID" });
  }

  const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: {
      phoneNumber: "Invalid 10 digit phone number",
      latitude: "latitude must be between -90 to 90",
      longitude: "longitude must be between -180 to 180",
    },
  });
  const schema = {
    name: {
      type: "string",
      min: 3,
      max: 100,
    },
    address: {
      type: "string",
    },
    latitude: {
      type: "any",
      custom: (val, errors) => {
        const lat = parseFloat(val);
        if (val < -90.0 || val > 90.0) {
          errors.push({ type: "latitude" });
        }
        return val;
      },
    },
    longitude: {
      type: "any",
      custom: (val, errors) => {
        const lat = parseFloat(val);
        if (val < -180.0 || val > 180.0) {
          errors.push({ type: "longitude" });
        }
        return val;
      },
    },
    ownerEmail: {
      type: "email",
    },
    invoicingEmail: {
      type: "email",
    },
    ownerPhone: {
      type: "string",
      length: 10,
      custom: (val, errors) => {
        if (!validator.isMobilePhone(val, ["en-IN"])) {
          errors.push({ type: "phoneNumber" });
        }
        return val;
      },
    },
    managerPhone: {
      type: "string",
      length: 10,
      custom: (val, errors) => {
        if (!validator.isMobilePhone(val, ["en-IN"])) {
          errors.push({ type: "phoneNumber" });
        }
        return val;
      },
    },
    whatsapp: {
      type: "string",
      custom: (val, errors) => {
        if (!validator.isMobilePhone(val)) {
          errors.push({ type: "phoneNumber" });
        }
        return val;
      },
    },
    bankac: {
      type: "string",
    },
    ifsc: {
      type: "string",
    },
    openingTime: {
      type: "string",
    },
    closingTime: {
      type: "string",
    },
  };

  for (let key in schema) {
    schema[key].optional = true;
  }

  const check = v.compile(schema);
  const checked = check(req.body);
  if (checked === true) {
    next();
  } else {
    res.status(400).json({ msg: "Errors in fields", errors: checked });
  }
};

export const validateDishRegisterBody = async (req, res, next) => {};

const validate = {
  validateLoginBody,
  validateRegBody,
  validateRestaurantRegisterBody,
  validateRestaurantUpdateBody,
};

export default validate;
