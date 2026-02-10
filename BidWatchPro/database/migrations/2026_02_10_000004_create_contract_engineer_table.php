<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contract_engineer', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('contract_id');
            $table->unsignedBigInteger('engineer_id');
            $table->string('role', 50); // 'project_engineer' or 'project_inspector'
            $table->timestamps();

            $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
            $table->foreign('engineer_id')->references('id')->on('engineers')->onDelete('cascade');
            $table->unique(['contract_id', 'engineer_id', 'role']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contract_engineer');
    }
};
