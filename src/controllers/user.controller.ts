import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import { registerValidation, loginValidation } from '../utils/validation';

export async function register(req: Request, res: Response): Promise<Response> {
  const { error } = registerValidation(req.body);
  console.log(req.body);
  if (error) {
    const message = error.details[0].message;
    return res.status(400).send(message);
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send('Email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    return res.send(savedUser);
  } catch (err) {
    return res.status(400).send(err);
  }
}

export async function login(req: Request, res: Response): Promise<Response> {
  const { error } = loginValidation(req.body);

  if (error) {
    const message = error.details[0].message;
    return res.status(400).send(message);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send('Email is not found');
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid password');
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || '');

  return res.send({ token });
}
