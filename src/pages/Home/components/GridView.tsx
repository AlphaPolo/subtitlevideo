import React from 'react';
import Grid from '@mui/material/Grid/Grid';
import { Itemrenderer } from '../../../global/utils/Itemrederer';
import Box from '@mui/material/Box/Box';

const GridView: React.FC<{items: any[], itemRenderer?: Itemrenderer}> = (props) => {

    return (
            // <Container sx={{ py: 12 }} maxWidth="md">
            <Box 
                display="flex"
                justifyContent="center"
                alignItems="center">
                <Grid 
                    container spacing={4}
                    sx={{ py: 12 }}
                    maxWidth="md">
                    {
                        props.items.map((item, index) => {
                            return(
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                {
                                    props.itemRenderer?.(item, index) || null
                                }
                            </Grid>
                            );
                        })
                    }
                </Grid>
            </Box>
            // </Container>
        );
}

export default GridView;