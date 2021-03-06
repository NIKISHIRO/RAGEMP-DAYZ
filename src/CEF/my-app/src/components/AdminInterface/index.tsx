import React from "react";
import './adminInterface.css';
import { useToggle, useKeyPress } from "@umijs/hooks";
import { VehicleCreate } from "./VehicleCreate";

function AdminInterface() {
    const { state, toggle } = useToggle(1);

    return (
        <div className='admin'>
            <div className='admin-interface'>
                <div className="admin-interface__container">
                    <div className="AI-sidebar">
                        <ul>
                            <li><a href="#" onClick={ () => toggle(1) }>Создание машины</a></li>
                        </ul>
                    </div>
                    <div className="AI-content">
                        <div className="AI-content__title">Панель администратора</div>
                        { state === 1 && <VehicleCreate /> }
                    </div>
                </div>
            </div>
        </div>
    );
}

export {
    AdminInterface,
}