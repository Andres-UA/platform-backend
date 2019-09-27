import { Request, Response } from 'express';
import { enrollAdmin } from '../network/enrollAdmin';
import { registerUser } from '../network/registerUser';
import { queryBC } from '../network/query';
import { invokeBC } from '../network/invoke';
import Service from '../models/Service';

export async function admin(req: Request, res: Response): Promise<Response> {
  await enrollAdmin();
  return res.status(200).send('');
}

export async function user(req: Request, res: Response): Promise<Response> {
  await registerUser();
  return res.status(200).send('usuario registrado');
}

export async function query(req: Request, res: Response): Promise<Response> {
  await queryBC();
  return res.status(200).send('');
}

export async function invoke(req: Request, res: Response): Promise<Response> {
  await invokeBC();
  return res.status(200).send('');
}

export async function store(req: Request, res: Response): Promise<Response> {
  const serviceId = req.params.id_service;

  let service = null;

  try {
    service = await Service.findOne({ _id: serviceId });
  } catch (err) {
    return res.status(400).send(err);
  }

  return res.status(200).json(service);
}

export async function index(req: Request, res: Response): Promise<Response> {
  return res.status(200).send('');
}

export async function show(req: Request, res: Response): Promise<Response> {
  return res.status(200).send('');
}

export async function update(req: Request, res: Response): Promise<Response> {
  return res.status(200).send('');
}
