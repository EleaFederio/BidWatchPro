import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Engineers',
        href: '#',
    },
];

export default function Engineers() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Engineers" />
            
        </AppLayout>
    );
}
