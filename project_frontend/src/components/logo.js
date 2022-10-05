import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

export const Logo = styled((props) => {
  const { variant, ...other } = props;

  const color = variant === 'light' ? '#C1C4D6' : '#5048E5';

  return (
    <img style={{ width: '200px' }} src="https://res.cloudinary.com/dx9dnqzaj/image/upload/v1648534295/guestclub/New_Project_yzn7lo.png" alt="Logo" />
  );
})``;

Logo.defaultProps = {
  variant: 'primary'
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['light', 'primary'])
};
