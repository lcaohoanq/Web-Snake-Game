// rules validate
// username         : isRequired
// password         : isRequired, min 8, max 30
// confirmedPassword: isRequired, min 8, max 30, isSame(password)

import { FormData } from '../models/validForm';

export type ValidationFunctionStringType = (value: string) => string;
export type ValidationFunctionType = (value: string | boolean) => string;
export type ControlNodeType = HTMLElement[];

export interface IParaObject {
  value: string | boolean;
  funcs: ValidationFunctionType[] | ValidationFunctionStringType[];
  parentNode: HTMLElement;
  controlNode: ControlNodeType;
}

export const isRequired: ValidationFunctionStringType = (value: string) => {
  return value == '' ? ' (*) Field is required' : '';
};

export const min =
  (num: number): ValidationFunctionStringType =>
  (value: string) =>
    value.length >= num ? '' : `Min is ${num}`;
export const max =
  (num: number): ValidationFunctionStringType =>
  (value: string) =>
    value.length <= num ? '' : `Max is ${num}`;

export const isSame =
  (paramValue: string, fieldName1: string, fieldName2: string): ValidationFunctionStringType =>
  (value: string) =>
    paramValue == value ? '' : `${fieldName1} not match ${fieldName2}`;

// create error message, show error message on UIe
export const createMsg = (parentNode: HTMLElement, controlNode: ControlNodeType, msg: string) => {
  const invalidDiv = document.createElement('div');
  invalidDiv.className = 'invalid-feedback';
  invalidDiv.innerHTML = msg;
  parentNode.appendChild(invalidDiv);
  controlNode.forEach((inputNode) => {
    inputNode.classList.add('is-invalid');
  });
};

export const isValid = (paraObject: IParaObject) => {
  const { value, funcs, parentNode, controlNode } = paraObject;

  for (const funcCheck of funcs) {
    if (typeof value == 'string') {
      const msg = funcCheck(value);
      createMsg(parentNode, controlNode, msg);
      return msg;
    } else if (typeof value == 'boolean') {
      const msg = '(*) Please check the box to finish the registration';
      createMsg(parentNode, controlNode, msg);
      return msg;
    }
  }
  return '';
};

// clear all error message
export const clearMsg = () => {
  document.querySelectorAll('.is-invalid').forEach((inputItem) => {
    inputItem.classList.remove('is-invalid');
  });

  document.querySelectorAll('.invalid-feedback').forEach((divMsg) => {
    divMsg.remove();
  });

  document.querySelectorAll('.invalid-feedback-tickBox').forEach((divMsg) => {
    divMsg.remove();
  });
};

// normal required field form validation
export const isValidForm = (...field: HTMLInputElement[]): boolean => {
  const errorMsg = field.map((item) =>
    isValid(new FormData(item.value, [isRequired], item.parentElement!, [item]))
  );
  return errorMsg.every((item) => !item);
};

// cusomize rule form validation
export const isValidFormCustom = (...field: HTMLInputElement[]): boolean => {
  const validations: ValidationFunctionType[] = [isRequired, min(8), max(30)] ?? [isRequired];
  const errorMsg = field.map((item) =>
    isValid(new FormData(item.checked ?? item.value, validations, item.parentElement!, [item]))
  );
  return errorMsg.every((item) => !item);
};

// isValid(usernameNode,passwordNode,confirmPasswordNode,tickBoxNode) => boolean
