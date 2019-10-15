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
  getHistoryTransaction,
} from '../utils/transaction';

export async function config(req: Request, res: Response): Promise<Response> {
  await enrollAdmin();
  await registerUser();
  return res.status(200).send('admin and user registered');
}

export async function store(req: Request, res: Response): Promise<Response> {
  const serviceId = req.params.id_service;
  const typeComponent = req.params.type_component;
  const nameComponent = req.params.name_component;

  if (!Types.ObjectId.isValid(serviceId)) {
    return res.status(400).json({
      success: false,
      error: 'Identificador de servicio invalido.',
    });
  }

  if (typeComponent !== 'participant' && typeComponent !== 'asset') {
    return res.status(400).json({
      success: false,
      message: 'Ruta no definida.',
    });
  }

  try {
    const service = await Service.findOne({ _id: serviceId });
    if (service !== null) {
      let nameFound = false;

      let components = null;
      if (typeComponent === 'participant') {
        components = service.participants;
      } else {
        components = service.assets;
      }

      for (let i = 0; i < components.length; i++) {
        let obj: any = components[i];
        if (obj.name === nameComponent) {
          nameFound = true;
          break;
        }
      }

      if (nameFound === false) {
        return res.status(400).json({
          success: false,
          message: `nombre del ${
            typeComponent === 'participant' ? 'particpante' : 'activo'
          } no encontrado.`,
        });
      }

      let fieldNames = [];
      for (let j = 0; j < components.length; j++) {
        let obj: any = components[j];

        if (obj.name === nameComponent) {
          for (let i = 0; i < obj.data.length; i++) {
            let input: any = obj.data[i];
            fieldNames.push(input.name);
            if (input.isRequired) {
              if (!req.body.hasOwnProperty(input.name)) {
                return res.status(400).json({
                  success: false,
                  error: 'se esperaba ' + input.name,
                });
              }
            }
          }

          break;
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
        typeComponent,
        nameComponent,
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
  const typeComponent = req.params.type_component;
  const nameComponent = req.params.name_component;

  if (!Types.ObjectId.isValid(serviceId)) {
    return res.status(400).json({
      success: false,
      error: 'Identificador de servicio invalido.',
    });
  }

  if (typeComponent !== 'participant' && typeComponent !== 'asset') {
    return res.status(400).json({
      success: false,
      message: 'Ruta no definida.',
    });
  }

  try {
    const service = await Service.findOne({ _id: serviceId });
    if (service !== null) {
      let nameFound = false;

      let components = null;
      if (typeComponent === 'participant') {
        components = service.participants;
      } else {
        components = service.assets;
      }

      for (let i = 0; i < components.length; i++) {
        let obj: any = components[i];
        if (obj.name === nameComponent) {
          nameFound = true;
        }
      }

      if (!nameFound) {
        return res.status(400).json({
          success: false,
          message: `nombre del ${
            typeComponent === 'participant' ? 'particpante' : 'activo'
          } no encontrado.`,
        });
      }

      let transaction: any = await getModelsTransaction(serviceId);
      if (transaction.success) {
        const model: [any] = JSON.parse(transaction.model);
        let data: [any] = [{}];
        data.pop();
        model.map(element => {
          if (
            element.Record.serviceId === serviceId &&
            element.Record.nameComponent === nameComponent
          ) {
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
  const typeComponent = req.params.type_component;
  const nameComponent = req.params.name_component;

  if (!Types.ObjectId.isValid(serviceId)) {
    return res.status(400).json({
      success: false,
      error: 'Identificador de servicio invalido.',
    });
  }

  if (typeComponent !== 'participant' && typeComponent !== 'asset') {
    return res.status(400).json({
      success: false,
      message: 'Ruta no definida.',
    });
  }

  try {
    const service = await Service.findOne({ _id: serviceId });
    if (service !== null) {
      let nameFound = false;

      let components = null;
      if (typeComponent === 'participant') {
        components = service.participants;
      } else {
        components = service.assets;
      }

      for (let i = 0; i < components.length; i++) {
        let obj: any = components[i];
        if (obj.name === nameComponent) {
          nameFound = true;
        }
      }

      if (!nameFound) {
        return res.status(400).json({
          success: false,
          message: `nombre del ${
            typeComponent === 'participant' ? 'particpante' : 'activo'
          } no encontrado.`,
        });
      }

      let transaction: any = await getModelTransaction(documentId);
      if (transaction.success) {
        const model: any = JSON.parse(transaction.model);
        const data = model.data;
        const id = model.serviceId;
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
  const typeComponent = req.params.type_component;
  const nameComponent = req.params.name_component;

  if (!Types.ObjectId.isValid(serviceId)) {
    return res.status(400).json({
      success: false,
      error: 'Identificador de servicio invalido.',
    });
  }

  if (typeComponent !== 'participant' && typeComponent !== 'asset') {
    return res.status(400).json({
      success: false,
      message: 'Ruta no definida.',
    });
  }

  try {
    const service = await Service.findOne({ _id: serviceId });
    if (service !== null) {
      let nameFound = false;

      let components = null;
      if (typeComponent === 'participant') {
        components = service.participants;
      } else {
        components = service.assets;
      }

      for (let i = 0; i < components.length; i++) {
        let obj: any = components[i];
        if (obj.name === nameComponent) {
          nameFound = true;
        }
      }

      if (!nameFound) {
        return res.status(400).json({
          success: false,
          message: `nombre del ${
            typeComponent === 'participant' ? 'particpante' : 'activo'
          } no encontrado.`,
        });
      }

      let fieldNames = [];
      for (let i = 0; i < components.length; i++) {
        let obj: any = components[i];

        if (obj.name === nameComponent) {
          for (let i = 0; i < obj.data.length; i++) {
            let input: any = obj.data[i];
            fieldNames.push(input.name);
            if (input.isRequired) {
              if (!req.body.hasOwnProperty(input.name)) {
                return res.status(400).json({
                  success: false,
                  error: 'se esperaba ' + input.name,
                });
              }
            }
          }
        }
      }
      let data: any = {};
      for (let key in fieldNames) {
        let name = fieldNames[key];
        data[name] = req.body[name];
      }
      let transaction: any = await updateTransaction(documentId, JSON.stringify(data));
      if (transaction.success) {
        return res.status(200).send('Transaccion enviada');
      } else {
        return res.status(200).send('Transaccion no enviada, error: ' + transaction.message);
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

export async function history(req: Request, res: Response): Promise<Response> {
  const serviceId = req.params.id_service;
  const typeComponent = req.params.type_component;
  const nameComponent = req.params.name_component;
  const documentId = req.params.id_model;

  if (!Types.ObjectId.isValid(serviceId)) {
    return res.status(400).json({
      success: false,
      error: 'Identificador de servicio invalido.',
    });
  }

  if (typeComponent !== 'participant' && typeComponent !== 'asset') {
    return res.status(400).json({
      success: false,
      message: 'Ruta no definida.',
    });
  }

  try {
    const service = await Service.findOne({ _id: serviceId });
    if (service !== null) {
      let nameFound = false;

      let components = null;
      if (typeComponent === 'participant') {
        components = service.participants;
      } else {
        components = service.assets;
      }

      for (let i = 0; i < components.length; i++) {
        let obj: any = components[i];
        if (obj.name === nameComponent) {
          nameFound = true;
        }
      }

      if (!nameFound) {
        return res.status(400).json({
          success: false,
          message: `nombre del ${
            typeComponent === 'participant' ? 'particpante' : 'activo'
          } no encontrado.`,
        });
      }

      let transaction: any = await getHistoryTransaction(documentId);
      if (transaction.success) {
        const model: [any] = JSON.parse(transaction.model);
        let data: [any] = [{}];
        data.pop();
        model.map(element => {
          data.push({
            id: element.Key,
            ...element.Record.data,
            timestamp: new Date(element.timestamp.seconds.low),
          });
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
