<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contract_project_status', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('contract_id');
            $table->unsignedBigInteger('project_status_id');
            $table->boolean('is_current')->default(false);
            $table->timestamps();

            $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
            $table->foreign('project_status_id')->references('id')->on('project_statuses')->onDelete('cascade');
            $table->unique(['contract_id', 'project_status_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contract_project_status');
    }
};
