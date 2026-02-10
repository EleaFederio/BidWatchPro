<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Contract;

class ProjectStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'status_name',
        'description',
    ];

    public function contracts()
    {
        return $this->belongsToMany(Contract::class, 'contract_project_status')
            ->withPivot('is_current')
            ->withTimestamps();
    }
}
