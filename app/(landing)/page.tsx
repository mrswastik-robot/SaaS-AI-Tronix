
import {Button} from '@/components/ui/button';
import Link from 'next/link';

import {LandingNavbar} from '@/components/landing-navbar';
import {LandingHero} from '@/components/landing-hero';
import {CreatorSection} from '@/components/creator-section';

const LandingPage = () => {
    return (
        <div className=' h-full'>
            <LandingNavbar />
            <LandingHero/>
            <CreatorSection/>

        </div>
    );
    }

export default LandingPage;
