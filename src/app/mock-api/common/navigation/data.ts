/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/landing',
        role : 'Admin'
    },
    {
        id   : 'users',
        title: 'User Management',
        type : 'basic',
        icon : 'heroicons_outline:user-group',
        link : '/usermanagement',
        role : 'Admin'
    },
    {
        id   : 'UserDashoard',
        title: 'Home',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/landing',
        role : 'User'
    },
    {
        id   : 'settings',
        title: 'settings',
        type : 'basic',
        icon : 'heroicons_outline:cog-8-tooth',
        link : '/settings',
        role : 'User'
    },

];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/landing'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/landing'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/landing'
    }
];
