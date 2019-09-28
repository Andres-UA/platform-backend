import { Request, Response } from "express";
import { serviceValidation } from "../utils/validation";
import Service from "../models/Service";

// create, edit
// index, store, show, update, destroy

export async function store(req: Request, res: Response): Promise<Response> {
  console.log(req.body);

  const { error } = serviceValidation(req.body);
  console.log(req.body);
  if (error) {
    const message = error.details[0].message;
    return res.status(400).send(message);
  }

  const service = new Service({
    name: req.body.name,
    description: req.body.description,
    model_schema: req.body.model_schema
  });

  try {
    const savedService = await service.save();
    return res.send(savedService);
  } catch (err) {
    return res.status(400).send(err);
  }
}

export async function index(req: Request, res: Response): Promise<Response> {
  return res.status(200).send("");
}

export async function show(req: Request, res: Response): Promise<Response> {
  return res.status(200).send("");
}

export async function update(req: Request, res: Response): Promise<Response> {
  return res.status(200).send("");
}

export async function destroy(req: Request, res: Response): Promise<Response> {
  return res.status(200).send("");
}
