import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Announcer',
        href: '#',
    },
];

export default function Announcer() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcer" />
            
        </AppLayout>
    );
}
