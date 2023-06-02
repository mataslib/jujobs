import { ThemeProvider } from '@emotion/react';
import { Box, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { darkTheme } from '../../adapters/styling/cssInJs/theme';


export const Footer = () => {

  return (
      <Paper square={true}
      >
        <Typography>
          {/* Copyright current year */}
          © 2021
        </Typography>
      </Paper>

  );
}