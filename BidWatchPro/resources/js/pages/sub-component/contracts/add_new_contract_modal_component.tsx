import React, { useState } from 'react';
import { Box, Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControlLabel, Checkbox, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Inertia } from '@inertiajs/inertia';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { NumericFormat } from 'react-number-format';

type ContractForm = {
    id_no: string;
    title: string;
    description?: string;
    approved_budget: string;
    pre_bid_date?: string;
    opening_of_bids_date?: string;
    start_of_posting_date?: string;
    end_of_posting_date?: string;
    pre_bid_none?: boolean;
};

type Props = {
    onCreate?: (form: ContractForm) => void;
};

export default function AddNewContractModalComponent({ onCreate }: Props) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<ContractForm>({
        id_no: '',
        title: '',
        description: '',
        approved_budget: '',
        pre_bid_none: false,
        pre_bid_date: '',
        opening_of_bids_date: '',
        start_of_posting_date: '',
        end_of_posting_date: '',
    });

    // Dayjs states for DateTimePicker (null when empty)
    const [preBidDate, setPreBidDate] = useState<Dayjs | null>(null);
    const [openingOfBidsDate, setOpeningOfBidsDate] = useState<Dayjs | null>(null);

    const [errors, setErrors] = useState<Partial<Record<keyof ContractForm, string>>>({});

    // NumericFormat custom adapter for MUI TextField
    function NumberFormatCustom(props: any) {
        const { inputRef, onChange, name, ...other } = props;
        return (
            <NumericFormat
                {...other}
                getInputRef={inputRef}
                onValueChange={(values) => {
                    onChange({ target: { name, value: values.value } });
                }}
                thousandSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
            />
        );
    }

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
        setErrors({});
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value } as any));
    }

    function formatPeso(value?: string) {
        if (!value && value !== '0') return '';
        const num = Number(value);
        if (isNaN(num)) return value || '';
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    }

    function normalizeCurrencyInput(input: string) {
        // remove all except digits and decimal point and minus
        return input.replace(/[^0-9.\-]/g, '');
    }

    function handlePreBidDateChange(value: Dayjs | null) {
        if (form.pre_bid_none) return;
        setPreBidDate(value);
        setForm((f) => ({ ...f, pre_bid_date: value ? value.toISOString() : '' } as any));
    }

    function handleOpeningOfBidsDateChange(value: Dayjs | null) {
        setOpeningOfBidsDate(value);
        setForm((f) => ({ ...f, opening_of_bids_date: value ? value.toISOString() : '' } as any));
    }

    function validate(f: ContractForm) {
        const errs: Partial<Record<keyof ContractForm, string>> = {};
        if (!f.id_no || f.id_no.trim().length !== 10) errs.id_no = 'ID No is required and must be 10 characters.';
        if (!f.title || f.title.trim().length === 0) errs.title = 'Title is required.';
        if (f.title && f.title.length > 255) errs.title = 'Title must be at most 255 characters.';
        if (f.description && f.description.length > 1000) errs.description = 'Description must be at most 1000 characters.';
        if (!f.approved_budget || isNaN(Number(f.approved_budget))) errs.approved_budget = 'Approved budget is required and must be a number.';
        return errs;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validation = validate(form);
        if (Object.keys(validation).length) {
            setErrors(validation);
            return;
        }

        const payload = { ...form } as any;

        if (onCreate) {
            onCreate(payload);
            closeModal();
            return;
        }

        Inertia.post('/contracts', payload, {
            onSuccess: () => closeModal(),
            onError: (serverErrors: any) => setErrors(serverErrors || {}),
        });
    }

    return (
        <>
            <Box sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1400 }}>
                <Fab color="primary" aria-label="add" onClick={openModal}>
                    <AddIcon />
                </Fab>
            </Box>

            <Dialog open={open} onClose={closeModal} fullWidth maxWidth="md">
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add New Contract</DialogTitle>
                    <DialogContent dividers>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                            <TextField label="ID No" name="id_no" value={form.id_no} onChange={handleChange} fullWidth required inputProps={{ maxLength: 10 }} error={!!errors.id_no} helperText={errors.id_no} size="small" />
                            <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required inputProps={{ maxLength: 255 }} error={!!errors.title} helperText={errors.title} size="small" />

                            <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline minRows={2} inputProps={{ maxLength: 1000 }} error={!!errors.description} helperText={errors.description} size="small" />

                            <TextField
                                label="Approved Budget"
                                name="approved_budget"
                                value={form.approved_budget}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputProps={{
                                    inputComponent: NumberFormatCustom as any,
                                    startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                                }}
                                error={!!errors.approved_budget}
                                helperText={errors.approved_budget}
                                size="small"
                            />


                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Box sx={{ flex: '0 0 25%', display: 'flex', alignItems: 'center' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={!!form.pre_bid_none}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setForm((f) => ({ ...f, pre_bid_none: checked, pre_bid_date: checked ? '' : f.pre_bid_date } as any));
                                                        if (checked) setPreBidDate(null);
                                                    }}
                                                    name="pre_bid_none"
                                                />
                                            }
                                            label="None"
                                        />
                                    </Box>

                                    <Box sx={{ flex: '0 0 75%' }}>
                                        <DateTimePicker
                                            label="Pre-bid Date"
                                            value={preBidDate || (form.pre_bid_date ? dayjs(form.pre_bid_date) : null)}
                                            onChange={handlePreBidDateChange}
                                            renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                            ampm
                                            disabled={!!form.pre_bid_none}
                                        />
                                    </Box>
                                </Box>
                                <DateTimePicker
                                    label="Opening of Bids Date"
                                    value={openingOfBidsDate || (form.opening_of_bids_date ? dayjs(form.opening_of_bids_date) : null)}
                                    onChange={handleOpeningOfBidsDateChange}
                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                    ampm
                                />
                            </LocalizationProvider>
                            <TextField label="Start of Posting Date" name="start_of_posting_date" value={form.start_of_posting_date} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} size="small" />

                            <TextField label="End of Posting Date" name="end_of_posting_date" value={form.end_of_posting_date} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} size="small" />

                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
