
import ReactDOM from 'react-dom/client';
import './index.css';
import { router } from './Router/router';
import { RouterProvider} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <div className='mainPage'>
        <RouterProvider router={router}/>   

    </div>
)
    
