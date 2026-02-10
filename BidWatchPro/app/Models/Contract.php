<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProjectStatus;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_no',
        'title',
        'description',
        'program_ammount',
        'approved_budget',
        'contract_cost',
        'contractor',
        'pre_bid_date',
        'opening_of_bids_date',
        'start_of_posting_date',
        'end_of_posting_date',
        'contract_start_date',
        'contract_end_date',
        'completion_date',
        'project_engineer',
        'project_inspector',
        'remarks',
        're_advertised',
        'status',
    ];

    protected $casts = [
        'program_ammount' => 'decimal:2',
        'approved_budget' => 'decimal:2',
        'contract_cost' => 'decimal:2',
        're_advertised' => 'boolean',
        'pre_bid_date' => 'date',
        'opening_of_bids_date' => 'date',
        'start_of_posting_date' => 'date',
        'end_of_posting_date' => 'date',
        'contract_start_date' => 'date',
        'contract_end_date' => 'date',
        'completion_date' => 'date',
        'status' => 'integer',
    ];

    public function engineers()
    {
        return $this->belongsToMany(Engineer::class, 'contract_engineer')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function projectEngineers()
    {
        return $this->engineers()->wherePivot('role', 'project_engineer');
    }

    public function projectInspectors()
    {
        return $this->engineers()->wherePivot('role', 'project_inspector');
    }

    public function projectStatuses()
    {
        return $this->belongsToMany(ProjectStatus::class, 'contract_project_status')
            ->withPivot('is_current')
            ->withTimestamps();
    }

    public function currentProjectStatus()
    {
        return $this->projectStatuses()->wherePivot('is_current', true);
    }
}
