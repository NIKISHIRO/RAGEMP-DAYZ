import React from "react";

type Props = {
    health: number;
    armor: number;
    hunger: number;
    dehydration: number;
    temperature: number;
};

function HudsMenuData(props: Props) {
    const percent = 12000 / 100; // 1%
    const blood = props.health * percent; // Количество крови.

    return (
        <div className="huds-menu-data">
            <div>Кровь: { blood }</div>
            <div>Броня: { props.armor }</div>
            <div>Сытость: { props.hunger }</div>
            <div>Жажда: { props.dehydration }</div>
            <div>Температура: { props.temperature }</div>
        </div>
    );
}

export {
    HudsMenuData,
}