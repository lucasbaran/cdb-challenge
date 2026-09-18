namespace Cdb.Application.Mapping;

using AutoMapper;
using Cdb.Application.DTOs;
using Cdb.Domain.Entities;

public sealed class CdbMappingProfile : Profile
{
    public CdbMappingProfile()
    {
        CreateMap<CdbInvestment, CalculateCdbResponse>()
            .ConstructUsing(src => new CalculateCdbResponse(
                src.InitialValue,
                src.Months,
                src.GrossValue,
                src.GrossProfit,
                src.TaxRate,
                src.Tax,
                src.NetValue));
    }
}