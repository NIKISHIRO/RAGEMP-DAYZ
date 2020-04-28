export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export enum NotifyVariant {
    DEFAULT = 'default',
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
}

enum NotifyVertical {
    TOP = 'top',
    BOTTOM = 'bottom',
}

enum NotifyHorizontal {
    CENTER = 'center',
    LEFT = 'left',
    RIGHT = 'right',
}

export type NotifyOrigin = {
    horizontal: NotifyHorizontal;
    vertical: NotifyVertical;
}

const enqueueSnackbar = (notification) => {
    const key = notification.options && notification.options.key;

    return {
        type: ENQUEUE_SNACKBAR,
        notification: {
            ...notification,
            key: key || new Date().getTime() + Math.random(),
        },
    };
};

const closeSnackbar = key => ({
    type: CLOSE_SNACKBAR,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
});

const removeSnackbar = key => ({
    type: REMOVE_SNACKBAR,
    key,
});

export {
    enqueueSnackbar,
    closeSnackbar,
    removeSnackbar,
}