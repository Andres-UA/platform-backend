import { Request, Response } from 'express';
import { enrollAdmin } from '../network/enrollAdmin';
import { registerUser } from '../network/registerUser';
import Service from '../models/Service';
import generate from '../utils/UUID';

import { Types } from 'mongoose';
import {
  createModelTransaction,
  getModelTransaction,
  updateTransaction,
  getModelsTransaction,
} from '../utils/transaction';

export async function config(req: Request, res: Response): Promise<Response> {
  await enrollAdmin();
  await registerUser();
  return res.status(200).send('admin and user registered');
}

export async function store(req: Request, res: Response): Promise<Response> {
  const serviceId = req.params.id_service;

  if (!Types.ObjectId.isValid(serviceId)) {
    return res.status(400).json({
      success: false,
      error: 'Identificador de servicio invalido.',
    });
  }

  try {
    const service = await Service.findOne({ _id: serviceId });
    if (service !== null) {
      let fieldNames = [];
      for (let i = 0; i < service.model_schema.length; i++) {
        let obj: any = service.model_schema[i];
        fieldNames.push(obj.name);
        if (obj.required) {
          if (!req.body.hasOwnProperty(obj.name)) {
            return res.status(400).json({
              success: false,
              error: 'se esperaba ' + obj.name,
            });
          }
        }
      }
      let data: any = {};
      for (let key in fieldNames) {
        let name = fieldNames[key];
        data[name] = req.body[name];
      }
      let uuid = generate();
      let transaction: any = await createModelTransaction(
        serviceId,
        uuid,
        JSON.stringify(data),
      );
      if (transaction.success) {
        return res.status(200).json({
          success: true,
          message: 'Transaccion enviada, id:' + uuid,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'Transaccion no enviada, error:' + transaction.message,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'se esperaba ' + 'El servicio no existe.',
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}

export async function index(req: Request, res: Response): Promise<Response> {
  const serviceId = req.params.id_service;

  if (!Types.ObjectId.isValid(serviceId)) {
    return res.status(400).json({
      success: false,
      error: 'Identificador de servicio invalido.',
    });
  }

  try {
    const service = await Service.findOne({ _id: serviceId });
    if (service !== null) {
      let transaction: any = await getModelsTransaction(serviceId);
      if (transaction.success) {
        const model: [any] = JSON.parse(transaction.model);
        let data: [any] = [{}];
        data.pop();
        model.map(element => {
          if (element.Record.srvId === serviceId) {
            data.push({
              id: element.Key,
              ...element.Record.data,
            });
          }
        });
        return res.status(200).json({
          success: true,
          data: data,
        });
      } else {
        return res.status(200).json({
          success: false,
          error: transaction.message,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'El servicio no existe.',
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err,
    });
  }
}

export async function show(req: Request, res: Response): Promise<Response> {
  const documentId = req.params.id_model;
  const serviceId = req.params.id_service;

  if (!Types.ObjectId.isValid(serviceId)) {
    return res.status(400).json({
      success: false,
      error: 'Identificador de servicio invalido.',
    });
  }

  try {
    const service = await Service.findOne({ _id: serviceId });
    if (service !== null) {
      let transaction: any = await getModelTransaction(documentId);
      if (transaction.success) {
        const model: any = JSON.parse(transaction.model);
        const data = model.data;
        const id = model.srvId;
        return res.status(200).json({
          id,
          ...data,
        });
      } else {
        return res.status(200).json({
          success: false,
          error: transaction.error,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'El servicio no existe.',
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  const serviceId = req.params.id_service;
  const documentId = req.params.id_model;

  if (!Types.ObjectId.isValid(serviceId)) {
    return res.status(400).send('Identificador de servicio invalido.');
  }

  try {
    const service = await Service.findOne({ _id: serviceId });
    if (service !== null) {
      let fieldNames = [];
      for (let i = 0; i < service.model_schema.length; i++) {
        let obj: any = service.model_schema[i];
        fieldNames.push(obj.name);
        if (obj.required) {
          if (!req.body.hasOwnProperty(obj.name)) {
            return res.status(400).send('se esperaba ' + obj.name);
          }
        }
      }
      let data: any = {};
      for (let key in fieldNames) {
        let name = fieldNames[key];
        data[name] = req.body[name];
      }
      let transaction: any = await updateTransaction(
        documentId,
        JSON.stringify(data),
      );
      if (transaction.success) {
        return res.status(200).send('Transaccion enviada');
      } else {
        return res
          .status(200)
          .send('Transaccion no enviada, error: ' + transaction.message);
      }
    } else {
      return res.status(400).send('El servicio no existe.');
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}
