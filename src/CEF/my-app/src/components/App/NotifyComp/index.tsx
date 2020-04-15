import * as React from 'react';
import { Snackbar } from "@material-ui/core"
import { setSnackbar } from '../../../actions/inventoryActions';
import { connect } from 'react-redux';
import { UIState } from '../../../reducers/UIReducer';

type Props = {
    UIState: UIState;
}

function NotifyComp(props: Props) {
    const { UIState } = props;
    // const {  } = UIState;

    return (
        <Snackbar
            anchorOrigin={{ vertical: snackbar.origin.vertical, horizontal: snackbar.origin.horizontal }}
            key={ `${snackbar.origin.vertical},${snackbar.origin.horizontal}` }
            open={ snackbar.open }
            message={ snackbar.text }
            autoHideDuration={ 3000 }
            onClose={ () => setSnackbar({ open: false }) }
        />        
    );
}

const mapStateToProps = (state: State) => ({
    UIState: state.UI,
});

const mapDispatchToProps = (dispatch) => ({
    setSnackbar: (snack) => dispatch(setSnackbar(snack)),
});

const NotifyCompConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
)(NotifyComp);

export {
    NotifyCompConnect as NotifyComp,
}