import ClearIcon from '@mui/icons-material/Clear';
import { Chip, Box, Typography } from "@mui/material";
import { FC } from "react";

type DeletableOptionProps = {
    title: string;
    onDelete(): void;
}

const DeletableOption: FC<DeletableOptionProps> = ({ title, onDelete }) => {
    return (
        <Chip
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                        {title}
                    </Typography>
                </Box>
            }
            onDelete={onDelete}
            deleteIcon={
                <ClearIcon
                    sx={{
                        fontSize: '18px',
                        '&:hover': {
                            color: 'error.main',
                        },
                    }}
                />
            }
            sx={{
                height: 32,
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                        ? theme.palette.grey[700]
                        : theme.palette.grey[200],
                color: (theme) => theme.palette.text.primary,
                '& .MuiChip-deleteIcon': {
                    color: 'inherit',
                    transition: 'color 0.2s ease-in-out',
                },
                '&:hover': {
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                            ? theme.palette.grey[600]
                            : theme.palette.grey[300],
                },
                transition: 'background-color 0.2s ease-in-out',
            }}
        />
    );
};

export default DeletableOption;