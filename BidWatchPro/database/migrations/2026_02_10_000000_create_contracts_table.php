<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('id_no', 10)->unique();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->decimal('program_ammount', 15, 2)->nullable();
            $table->decimal('approved_budget', 15, 2);
            $table->decimal('contract_cost', 15, 2)->nullable();
            $table->string('contractor', 100)->nullable();
            $table->date('pre_bid_date')->nullable();
            $table->date('opening_of_bids_date')->nullable();
            $table->date('start_of_posting_date')->nullable();
            $table->date('end_of_posting_date')->nullable();
            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();
            $table->date('completion_date')->nullable();
            $table->string('project_engineer', 100)->nullable();
            $table->string('project_inspector', 100)->nullable();
            $table->string('remarks', 255)->nullable();
            $table->boolean('re_advertised')->default(false);
            $table->decimal('status', 1, 0)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
