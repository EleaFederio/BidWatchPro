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
    program_ammount?: string;
    approved_budget: string;
    contract_cost?: string;
    contractor?: string;
    pre_bid_date?: string;
    opening_of_bids_date?: string;
    start_of_posting_date?: string;
    end_of_posting_date?: string;
    contract_start_date?: string;
    contract_end_date?: string;
    completion_date?: string;
    project_engineer?: string;
    project_inspector?: string;
    remarks?: string;
    re_advertised: boolean;
    status: number;
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
        program_ammount: '',
        approved_budget: '',
        contract_cost: '',
        contractor: '',
        pre_bid_date: '',
        opening_of_bids_date: '',
        start_of_posting_date: '',
        end_of_posting_date: '',
        contract_start_date: '',
        contract_end_date: '',
        completion_date: '',
        project_engineer: '',
        project_inspector: '',
        remarks: '',
        re_advertised: false,
        status: 0,
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
        if (f.contractor && f.contractor.length > 100) errs.contractor = 'Contractor must be at most 100 characters.';
        if (f.project_engineer && f.project_engineer.length > 100) errs.project_engineer = 'Project engineer must be at most 100 characters.';
        if (f.project_inspector && f.project_inspector.length > 100) errs.project_inspector = 'Project inspector must be at most 100 characters.';
        if (f.remarks && f.remarks.length > 255) errs.remarks = 'Remarks must be at most 255 characters.';
        if (f.status == null || !Number.isInteger(f.status)) errs.status = 'Status is required and must be an integer.';
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
                                label="Program Amount"
                                name="program_ammount"
                                value={form.program_ammount}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    inputComponent: NumberFormatCustom as any,
                                    startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                                }}
                                size="small"
                            />

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

                            <TextField
                                label="Contract Cost"
                                name="contract_cost"
                                value={form.contract_cost}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    inputComponent: NumberFormatCustom as any,
                                    startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                                }}
                                size="small"
                            />

                            <TextField label="Contractor" name="contractor" value={form.contractor} onChange={handleChange} fullWidth inputProps={{ maxLength: 100 }} error={!!errors.contractor} helperText={errors.contractor} size="small" />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Pre-bid Date"
                                    value={preBidDate || (form.pre_bid_date ? dayjs(form.pre_bid_date) : null)}
                                    onChange={handlePreBidDateChange}
                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                    ampm
                                />

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
                            <TextField label="Contract Start Date" name="contract_start_date" value={form.contract_start_date} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} size="small" />

                            <TextField label="Contract End Date" name="contract_end_date" value={form.contract_end_date} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} size="small" />
                            <TextField label="Completion Date" name="completion_date" value={form.completion_date} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} size="small" />

                            <TextField label="Project Engineer" name="project_engineer" value={form.project_engineer} onChange={handleChange} fullWidth inputProps={{ maxLength: 100 }} error={!!errors.project_engineer} helperText={errors.project_engineer} size="small" />
                            <TextField label="Project Inspector" name="project_inspector" value={form.project_inspector} onChange={handleChange} fullWidth inputProps={{ maxLength: 100 }} error={!!errors.project_inspector} helperText={errors.project_inspector} size="small" />

                            <TextField label="Remarks" name="remarks" value={form.remarks} onChange={handleChange} fullWidth inputProps={{ maxLength: 255 }} error={!!errors.remarks} helperText={errors.remarks} size="small" />
                            <TextField label="Status" name="status" value={String(form.status)} onChange={(e) => setForm((f) => ({ ...f, status: Number(e.target.value) }))} fullWidth type="number" inputProps={{ min: 0, max: 9, step: 1 }} error={!!errors.status} helperText={errors.status} size="small" />

                            <FormControlLabel control={<Checkbox checked={form.re_advertised} onChange={(e) => setForm((f) => ({ ...f, re_advertised: e.target.checked }))} name="re_advertised" />} label="Re-advertised" />
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
