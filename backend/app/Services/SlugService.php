<?php

namespace App\Services;

use Illuminate\Support\Str;

class SlugService
{
    public static function generate(string $title, string $model, ?int $exceptId = null): string
    {
        $slug  = Str::slug($title);
        $base  = $slug;
        $count = 1;
        while (true) {
            $q = $model::where('slug', $slug);
            if ($exceptId) $q->where('id', '!=', $exceptId);
            if (!$q->exists()) break;
            $slug = $base . '-' . $count++;
        }
        return $slug;
    }
}
