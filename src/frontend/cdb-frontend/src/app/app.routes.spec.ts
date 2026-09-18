import { Routes } from '@angular/router';

describe('App Routes', () => {
  let routes: Routes;

  beforeEach(() => {
    jest.resetModules();
    routes = require('./app.routes').routes;
  });

  it('should have two routes configured', () => {
    expect(routes.length).toBe(2);
  });

  it('should redirect root path to calculator', () => {
    const rootRoute = routes.find((r) => r.path === '');
    expect(rootRoute).toBeTruthy();
    expect(rootRoute!.redirectTo).toBe('/calculator');
    expect(rootRoute!.pathMatch).toBe('full');
  });

  it('should have calculator route with lazy loaded component', () => {
    const calculatorRoute = routes.find((r) => r.path === 'calculator');
    expect(calculatorRoute).toBeTruthy();
    expect(calculatorRoute!.loadComponent).toBeDefined();
    expect(typeof calculatorRoute!.loadComponent).toBe('function');
  });

  it('should load calculator component correctly', async () => {
    const calculatorRoute = routes.find((r) => r.path === 'calculator');
    expect(calculatorRoute).toBeTruthy();
    
    const CalculatorPage = await calculatorRoute!.loadComponent!();
    expect(CalculatorPage).toBeDefined();
    expect(typeof CalculatorPage).toBe('function');
  });
});