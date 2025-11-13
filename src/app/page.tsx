import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import MobileDetect from 'mobile-detect';

export default async function Home() {
    const userAgent = (await headers()).get('user-agent') || '';
    const mobileDetect = new MobileDetect(userAgent);

    if (mobileDetect.mobile()) {
        redirect('/scanner');
    } else {
        redirect('/item');
    }
}
