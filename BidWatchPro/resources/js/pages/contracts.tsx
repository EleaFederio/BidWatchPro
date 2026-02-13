import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import AddNewContractModalComponent from './sub-component/contracts/add_new_contract_modal_component';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contracts',
        href: '#',
    },
];

export default function Contracts() {
    function handleCreate(form: any) {
        // submit to backend to persist contract (including pre_bid_date)
        // keeps existing behavior of using Inertia when available
        // form is expected to include `pre_bid_date` as ISO string or empty
        // and `pre_bid_none` when user selected None
        // remove pre_bid_none before sending if true to leave database null
        const payload = { ...form };
        if (payload.pre_bid_none) {
            payload.pre_bid_date = null;
            delete payload.pre_bid_none;
        }

        // post to contracts endpoint
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { Inertia } = require('@inertiajs/inertia');
        Inertia.post('/contracts', payload);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contracts" />

            <AddNewContractModalComponent onCreate={handleCreate} />

        </AppLayout>
    );
}
