import { Request, Response } from 'express';
import { serviceValidation } from '../utils/validation';
import Service from '../models/Service';

// create, edit
// index, store, show, update, destroy

export async function store(req: Request, res: Response): Promise<Response> {
  const { error } = serviceValidation(req.body);
  if (error) {
    const message = error.details[0].message;
    return res.status(400).json({ error: message });
  }

  const service = new Service({
    name: req.body.name,
    description: req.body.description,
    participants: req.body.participants,
    assets: req.body.assets
  });

  try {
    const savedService = await service.save();
    return res.status(200).json({ id: savedService._id });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
}

export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const services = await Service.find({});
    return res.status(200).json(services);
  } catch (err) {
    return res.status(400).send(err);
  }
}

export async function show(req: Request, res: Response): Promise<Response> {
  try {
    const service = await Service.findOne({ _id: req.params.id });
    return res.status(200).json(service);
  } catch (err) {
    return res.status(400).send(err);
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  return res.status(200).send('');
}

export async function destroy(req: Request, res: Response): Promise<Response> {
  return res.status(200).send('');
}
