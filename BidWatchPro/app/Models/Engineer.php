<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Engineer extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'middle_initial',
        'email',
        'phone_number',
    ];

    protected $casts = [
        // No special casts required; keep defaults
    ];

    public function contracts()
    {
        return $this->belongsToMany(Contract::class, 'contract_engineer')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function projectEngineerContracts()
    {
        return $this->contracts()->wherePivot('role', 'project_engineer');
    }

    public function projectInspectorContracts()
    {
        return $this->contracts()->wherePivot('role', 'project_inspector');
    }
}
