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
    function handleCreate(form: { title: string; client: string; amount: string }) {
        // TODO: replace with Inertia.post to create contract
        console.log('Create contract', form);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contracts" />

            <AddNewContractModalComponent onCreate={handleCreate} />

        </AppLayout>
    );
}
