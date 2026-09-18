namespace Cdb.Domain.Interfaces;

using Cdb.Domain.Entities;

public interface ICdbCalculator
{
    CdbInvestment Calculate(decimal initialValue, int months);
}