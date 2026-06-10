<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $langs = [
            ['code' => 'en', 'name' => 'English',  'native_name' => 'English', 'direction' => 'ltr', 'is_default' => true,  'is_active' => true],
            ['code' => 'ar', 'name' => 'Arabic',   'native_name' => 'العربية', 'direction' => 'rtl', 'is_default' => false, 'is_active' => true],
            ['code' => 'sw', 'name' => 'Swahili',  'native_name' => 'Kiswahili','direction' => 'ltr', 'is_default' => false, 'is_active' => true],
            ['code' => 'lg', 'name' => 'Luganda',  'native_name' => 'Luganda', 'direction' => 'ltr', 'is_default' => false, 'is_active' => true],
        ];
        foreach ($langs as $l) Language::updateOrCreate(['code' => $l['code']], $l);
        $this->command->info('Languages seeded.');
    }
}
