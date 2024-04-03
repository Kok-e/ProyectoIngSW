import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { LayoutMain } from '../layout/LayoutMain'
import { ListarBrigadista } from '../src/components/ListarBrigadista';
import { ActualizarBrigadista } from '../src/components/ActualizarBrigadista';
import { FormBrigadista } from '../src/components/FormBrigadista';
import { Cargando } from '../src/components/Cargando';
import { CrearPractica } from '../src/components/crearPractica';
import { ListarPractica } from '../src/components/ListarPracticas';
import { ActualizarPractica } from '../src/components/actualizarPractica';
import { ListarCuadrilla } from '../src/components/ListarCuadrilla';
import { ActualizarCuadrilla } from '../src/components/ActualizarCuadrilla';
import { FormCuadrilla } from '../src/components/FormCuadrilla';
import { Exportar } from '../src/components/Exportar';
export const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/inicio' element={<LayoutMain />}>
          <Route index element={<ListarBrigadista />} />
          <Route path='cargando' element={<Cargando />} />
          <Route path='listarBrigadista' element={<ListarBrigadista />} />
          <Route path='actualizarBrigadista/:id' element={<ActualizarBrigadista />} />
          <Route path='registrarBrigadista' element={<FormBrigadista />} />
          <Route path='ListarPracticas' element={<ListarPractica />} />
          <Route path='actualizarPractica' element={<ActualizarPractica />} />
          <Route path='crearPractica' element={<CrearPractica />} />
          <Route path='ListarCuadrilla' element={<ListarCuadrilla />} />
          <Route path='FormCuadrilla' element={<FormCuadrilla />} />
          <Route path='ActualizarCuadrilla/:id' element={<ActualizarCuadrilla />} />
          <Route path='Exportar' element={<Exportar />} />
        </Route>

        <Route path='*' element={
          <>
            <p>
              <h1>ERROR 404</h1>
              <Link to='/inicio'>Volver al inicio</Link>
            </p>
          </>
        }
        />
      </Routes>
    </BrowserRouter>
  )
}
