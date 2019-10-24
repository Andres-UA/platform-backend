import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import { registerValidation, loginValidation } from '../utils/validation';

export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).send(err);
  }
}

export async function store(req: Request, res: Response): Promise<Response> {
  const { error } = registerValidation(req.body);
  if (error) {
    const message = error.details[0].message;
    return res.status(400).send(message);
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send('Email already exists');
  }

  const identificationExist = await User.findOne({ identification: req.body.identification });
  if (identificationExist) {
    return res.status(400).send('Identification already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    identification: req.body.identification,
    email: req.body.email,
    type: req.body.type,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    return res.send(savedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
}

export async function getUser(req: Request, res: Response): Promise<Response> {
  console.log(req.user);

  const user = await User.findById(req.user._id);
  if (user) {
    return res.json({
      success: true,
      user: {
        user: user._id,
        type: user.type,
        name: user.name,
        identification: user.identification,
        email: user.email,
      }
    });
  }

  return res.status(200).json({ success: false, error: 'User not found' });
}

export async function login(req: Request, res: Response): Promise<Response> {
  const { error } = loginValidation(req.body);
  if (error) {
    const message = error.details[0].message;
    return res.status(400).json({ success: false, message });
  }

  const user = await User.findOne({ identification: req.body.identification });
  if (!user) {
    return res.status(400).json({ success: false, message: 'Email is not found' });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ success: false, message: 'Invalid password' });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || '');

  return res.status(200).json({ success: true, token });
}
