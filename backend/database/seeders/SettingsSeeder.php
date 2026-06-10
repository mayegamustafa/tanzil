<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Brand
            ['key' => 'site_name',           'value' => 'Tanzeel Travels',            'group' => 'brand'],
            ['key' => 'site_tagline',        'value' => 'Your Sacred Journey Awaits', 'group' => 'brand'],
            ['key' => 'site_description',    'value' => 'Premium Hajj, Umrah & Tours from Uganda — crafted with care for every pilgrim.', 'group' => 'brand'],
            ['key' => 'site_logo',           'value' => '/images/logo.png',           'group' => 'brand'],
            ['key' => 'site_favicon',        'value' => '/images/favicon.ico',        'group' => 'brand'],
            ['key' => 'currency',            'value' => 'USD',                        'group' => 'brand'],
            ['key' => 'currency_symbol',     'value' => '$',                          'group' => 'brand'],

            // Contact
            ['key' => 'phone_primary',       'value' => '+256785925106', 'group' => 'contact'],
            ['key' => 'phone_secondary',     'value' => '+256700958422', 'group' => 'contact'],
            ['key' => 'phone_saudi',         'value' => '+966592250741', 'group' => 'contact'],
            ['key' => 'whatsapp',            'value' => '+256785925106', 'group' => 'contact'],
            ['key' => 'email',               'value' => 'info@tanzeeltravels.com', 'group' => 'contact'],
            ['key' => 'address',             'value' => 'Masitowa Ndejje, off Entebbe Road, Eddie Petroleum Building, Kampala, Uganda', 'group' => 'contact'],

            // Social
            ['key' => 'facebook',            'value' => 'https://facebook.com/tanzeeltravels', 'group' => 'social'],
            ['key' => 'instagram',           'value' => 'https://instagram.com/tanzeeltravels','group' => 'social'],
            ['key' => 'twitter',             'value' => '',                                    'group' => 'social'],
            ['key' => 'youtube',             'value' => '',                                    'group' => 'social'],
            ['key' => 'tiktok',              'value' => '',                                    'group' => 'social'],

            // Hero
            ['key' => 'hero_title',          'value' => 'Your Sacred Journey to the Holy Land Begins Here', 'group' => 'hero'],
            ['key' => 'hero_subtitle',       'value' => 'Experience the spiritual journey of a lifetime with our carefully crafted Hajj and Umrah packages, designed for comfort, devotion, and peace of mind.', 'group' => 'hero'],
            ['key' => 'hero_image',          'value' => '/images/hero-makkah.jpg', 'group' => 'hero'],
            ['key' => 'hero_cta_text',       'value' => 'Explore Packages',        'group' => 'hero'],
            ['key' => 'hero_cta_secondary',  'value' => 'Contact Us',              'group' => 'hero'],

            // Stats
            ['key' => 'stat_pilgrims',       'value' => '5000+',  'group' => 'stats'],
            ['key' => 'stat_years',          'value' => '15+',    'group' => 'stats'],
            ['key' => 'stat_packages',       'value' => '50+',    'group' => 'stats'],
            ['key' => 'stat_countries',      'value' => '10+',    'group' => 'stats'],
            ['key' => 'stat_pilgrims_label', 'value' => 'Happy Pilgrims', 'group' => 'stats'],
            ['key' => 'stat_years_label',    'value' => 'Years of Service', 'group' => 'stats'],
            ['key' => 'stat_packages_label', 'value' => 'Packages Offered', 'group' => 'stats'],
            ['key' => 'stat_countries_label','value' => 'Countries Served', 'group' => 'stats'],

            // About
            ['key' => 'about_title',         'value' => 'About Tanzeel Travels', 'group' => 'about'],
            ['key' => 'about_content',       'value' => 'Tanzeel Travels is a licensed travel agency based in Kampala, Uganda, specializing in premium Hajj, Umrah, and international tour packages. With over 15 years of experience, we have guided thousands of pilgrims on their sacred journeys with unmatched care and professionalism.', 'group' => 'about'],
            ['key' => 'about_image',         'value' => '/images/about.jpg', 'group' => 'about'],
            ['key' => 'about_mission',       'value' => 'To provide every pilgrim with a seamless, spiritually enriching journey to the Holy Land, backed by dedicated service and deep Islamic values.', 'group' => 'about'],
            ['key' => 'about_vision',        'value' => 'To be East Africa\'s most trusted and beloved Hajj and Umrah operator, known for excellence, integrity, and genuine care for every traveler.', 'group' => 'about'],

            // SEO
            ['key' => 'meta_title',          'value' => 'Tanzeel Travels — Premium Hajj, Umrah & Tours from Uganda', 'group' => 'seo'],
            ['key' => 'meta_description',    'value' => 'Book your Hajj, Umrah or tour package with Tanzeel Travels. Licensed Uganda-based operator with 15+ years of experience.', 'group' => 'seo'],
            ['key' => 'meta_keywords',       'value' => 'Hajj Uganda, Umrah Uganda, Tanzeel Travels, Kampala tours, pilgrimage packages', 'group' => 'seo'],

            // Footer
            ['key' => 'footer_tagline',      'value' => 'Guiding pilgrims to the Sacred Lands with care, devotion, and unmatched expertise.', 'group' => 'footer'],
            ['key' => 'footer_copyright',    'value' => '© 2025 Tanzeel Travels. All rights reserved.', 'group' => 'footer'],
        ];

        foreach ($settings as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }
        $this->command->info('Settings seeded (' . count($settings) . ' records).');
    }
}
