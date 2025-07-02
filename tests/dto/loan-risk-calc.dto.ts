export class LoanRiskCalcDto {
  income: number;
  debt: number;
  age: number;
  employed: boolean;
  loanAmount: number;
  loanPeriod: number;

  private constructor(income: number, debt: number, age: number, employed: boolean, loanAmount: number, loanPeriod: number) {
    this.income = income;
    this.debt = debt;
    this.age = age;
    this.employed = employed;
    this.loanAmount = loanAmount;
    this.loanPeriod = loanPeriod;
  }

  static createParamsWithVariableLoanPeriod(loanPeriod: number): LoanRiskCalcDto {
    return new LoanRiskCalcDto(2000, 0, 25, true, 500, loanPeriod);
  }

  static createParamsWithZeroes(): LoanRiskCalcDto {
    return new LoanRiskCalcDto(0, 0, 0, true, 0, 0);
  }

  static createParamsWithVariableDebt(debt: number): LoanRiskCalcDto {
    return new LoanRiskCalcDto(2000, debt, 25, true, 500, 12);
  }

  static createParamsWithVariableAge(age: number): LoanRiskCalcDto {
    return new LoanRiskCalcDto(100, 0, age, true, 1000, 12);
  }

  static createParamsWithVariableLoanAmount(loanAmount: number): LoanRiskCalcDto {
    return new LoanRiskCalcDto(2000, 0, 25, true, loanAmount, 12);
  }
}
