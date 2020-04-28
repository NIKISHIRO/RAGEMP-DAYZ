const constants = {
    DECREMENT_DEHYDRATION_HEALTH: 3, // Сколько отнимать когда шкала достигает нуля.
    DECREMENT_DEHYDRATION_BAR: 1, // По сколько отнимать шкалу.
    DECREMENT_TIME: 5000, // Каждые сколько секунд вычитать здоровье.
    CHECK_TIME: 30000, // Каждые сколько секунд вычитать шкалу.

    DECREMENT_HUNGER_HEALTH: 3, // Сколько отнимать когда шкала достигает нуля.
    DECREMENT_HUNGER_BAR: 1, // По сколько отнимать шкалу сытости.
    DECREMENT_DEHYDRATION_TIME: 5000, // Каждые сколько секунд вычитать здоровье из-за сытости.
    CHECK_DEHYDRATION_TIME: 30000, // Каждые сколько секунд вычитать шкалу сытости.
};

export {
    constants,
}