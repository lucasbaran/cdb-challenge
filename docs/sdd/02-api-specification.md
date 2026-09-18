# API Specification

## Base URL
```
/api/v1
```

## Endpoints

### Calculate CDB Investment
**POST** `/cdb/calculate`

#### Request
```json
{
  "initialValue": 1000.00,
  "months": 12
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| initialValue | decimal | Yes | > 0 |
| months | integer | Yes | > 1 |

#### Success Response (200 OK)
```json
{
  "initialValue": 1000.00,
  "months": 12,
  "grossValue": 1123.09,
  "grossProfit": 123.09,
  "taxRate": 0.20,
  "tax": 24.62,
  "netValue": 1098.47
}
```

| Field | Type | Description |
|-------|------|-------------|
| initialValue | decimal | Echo of input |
| months | integer | Echo of input |
| grossValue | decimal | Final accumulated value |
| grossProfit | decimal | Gross profit (grossValue - initialValue) |
| taxRate | decimal | Applied tax rate (0.225, 0.20, 0.175, 0.15) |
| tax | decimal | Tax amount |
| netValue | decimal | Net value after tax |

#### Error Responses

**400 Bad Request** - Validation Error
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "initialValue": ["The initial value must be greater than zero."],
    "months": ["The term must be greater than 1 month."]
  }
}
```

**500 Internal Server Error** - Unexpected Error
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.6.1",
  "title": "An error occurred while processing your request.",
  "status": 500
}
```

## Headers

### Request
| Header | Required | Description |
|--------|----------|-------------|
| Content-Type | Yes | application/json |
| X-Correlation-Id | No | Client-generated correlation ID |

### Response
| Header | Description |
|--------|-------------|
| X-Correlation-Id | Echo of request correlation ID or generated |

## Versioning
- URL-based versioning: `/api/v1/`
- Breaking changes require new version (v2)

## OpenAPI Tags
- `CDB` - CDB calculation endpoints