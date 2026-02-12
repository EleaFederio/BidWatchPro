<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Use raw statements to alter column types to DATETIME (works for MySQL)
        DB::statement('ALTER TABLE `contracts` MODIFY `pre_bid_date` DATETIME NULL');
        DB::statement('ALTER TABLE `contracts` MODIFY `opening_of_bids_date` DATETIME NULL');
    }

    public function down(): void
    {
        // Revert back to DATE
        DB::statement('ALTER TABLE `contracts` MODIFY `pre_bid_date` DATE NULL');
        DB::statement('ALTER TABLE `contracts` MODIFY `opening_of_bids_date` DATE NULL');
    }
};
