import { expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { LoanRiskCalcDto } from './dto/loan-risk-calc.dto';

test.describe('LoanRiskCalcDto', () => {
  const baseUrl = 'https://backend.tallinn-learning.ee/api/loan-calc/decision';
  test.describe('Successful request', () => {
    test('Low risk positive decision', async ({ request }) => {
      const requestBody = LoanRiskCalcDto.createParamsWithVariableLoanPeriod(12);
      const response = await request.post(`${baseUrl}`, {
        data: requestBody
      });
      expect.soft(response.status()).toBe(StatusCodes.OK);

      const body = await response.json();

      expect.soft(body.applicationId).toBeDefined();
      expect.soft(body).toHaveProperty('riskScore');
      expect.soft(body).toHaveProperty('riskLevel', 'Low Risk');
      expect.soft(body).toHaveProperty('riskDecision', 'positive');
      expect.soft(body).toHaveProperty('riskPeriods');
      expect.soft(body.riskPeriods).toContain(requestBody.loanPeriod);
      expect.soft(body).toHaveProperty('applicationId');
      expect.soft(body.riskPeriods).toEqual(expect.arrayContaining([12, 18, 24, 30, 36]));
    });

    test('Medium risk positive decision', async ({ request }) => {
      const requestBody = LoanRiskCalcDto.createParamsWithVariableLoanPeriod(6);
      const response = await request.post(`${baseUrl}`, {
        data: requestBody
      });
      expect.soft(response.status()).toBe(StatusCodes.OK);

      const body = await response.json();

      expect.soft(body.applicationId).toBeDefined();
      expect.soft(body).toHaveProperty('riskScore');
      expect.soft(body).toHaveProperty('riskLevel', 'Medium Risk');
      expect.soft(body).toHaveProperty('riskDecision', 'positive');
      expect.soft(body).toHaveProperty('riskPeriods');
      expect.soft(body.riskPeriods).toContain(requestBody.loanPeriod);
      expect.soft(body).toHaveProperty('applicationId');
      expect.soft(body.riskPeriods).toEqual(expect.arrayContaining([6, 9, 12]));
    });

    test('High risk positive decision', async ({ request }) => {
      const requestBody = LoanRiskCalcDto.createParamsWithVariableLoanPeriod(3);
      const response = await request.post(`${baseUrl}`, {
        data: requestBody
      });
      expect.soft(response.status()).toBe(StatusCodes.OK);

      const body = await response.json();

      expect.soft(body.applicationId).toBeDefined();
      expect.soft(body).toHaveProperty('riskScore');
      expect.soft(body).toHaveProperty('riskLevel', 'High Risk');
      expect.soft(body).toHaveProperty('riskDecision', 'positive');
      expect.soft(body).toHaveProperty('riskPeriods');
      expect.soft(body.riskPeriods).toContain(requestBody.loanPeriod);
      expect.soft(body).toHaveProperty('applicationId');
      expect.soft(body.riskPeriods).toEqual(expect.arrayContaining([3, 6]));
    });

    test('Very high risk negative decision', async ({ request }) => {
      const requestBody = LoanRiskCalcDto.createParamsWithVariableAge(17);
      const response = await request.post(`${baseUrl}`, {
        data: requestBody
      });
      expect.soft(response.status()).toBe(StatusCodes.OK);

      const body = await response.json();

      expect.soft(body.applicationId).toBeDefined();
      expect.soft(body).toHaveProperty('riskScore');
      expect.soft(body).toHaveProperty('riskLevel', 'Very High Risk');
      expect.soft(body).toHaveProperty('riskDecision', 'negative');
      expect.soft(body).toHaveProperty('riskPeriods');
      expect.soft(body).toHaveProperty('applicationId');
      expect.soft(body.riskPeriods).toEqual([]);
    });
  });

  test.describe('Unsuccessful request', () => {
    test('without request body', async ({ request }) => {
      const response = await request.post(`${baseUrl}`);
      expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
    });

    test('with empty request body', async ({ request }) => {
      const response = await request.post(`${baseUrl}`, {
        data: {}
      });
      expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
    });

    test('with zero values of digital request body parameters', async ({ request }) => {
      const requestBody = LoanRiskCalcDto.createParamsWithZeroes();
      const response = await request.post(`${baseUrl}`, {
        data: requestBody
      });
      expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
    });

    test('with negative value of debt', async ({ request }) => {
      const requestBody = LoanRiskCalcDto.createParamsWithVariableDebt(-5);
      const response = await request.post(`${baseUrl}`, {
        data: requestBody
      });
      expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
    });

    test('with negative value of age', async ({ request }) => {
      const requestBody = LoanRiskCalcDto.createParamsWithVariableAge(-5);
      const response = await request.post(`${baseUrl}`, {
        data: requestBody
      });
      expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
    });

    test('with negative value of loanAmount', async ({ request }) => {
      const requestBody = LoanRiskCalcDto.createParamsWithVariableLoanAmount(-5);
      const response = await request.post(`${baseUrl}`, {
        data: requestBody
      });
      expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
    });

    test('with negative value of loanPeriod', async ({ request }) => {
      const requestBody = LoanRiskCalcDto.createParamsWithVariableLoanPeriod(-5);
      const response = await request.post(`${baseUrl}`, {
        data: requestBody
      });
      expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
