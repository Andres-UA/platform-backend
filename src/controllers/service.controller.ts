import { Request, Response } from 'express';

// create, edit
// index, store, show, update, destroy

export async function store(req: Request, res: Response): Promise<Response> {
  return res.status(200).send('');
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

export async function destroy(req: Request, res: Response): Promise<Response> {
  return res.status(200).send('');
}
