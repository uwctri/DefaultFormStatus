<?php

namespace UWMadison\defaultFormStatus;
use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;

use REDcap;

class defaultFormStatus extends AbstractExternalModule {
    
    private $module_prefix = 'default_form_status';
    private $module_global = 'defaultFormStatus';
    private $module_name = 'defaultFormStatus';
    
    public function __construct() {
            parent::__construct();
    }
    
    public function redcap_every_page_top($project_id) {
        $this->initGlobal();

        if (strpos(PAGE, 'Design/online_designer.php') !== false && $project_id != NULL && $_GET['page']) {
            $json = $this->loadJSON($_GET['page']);
            $json = !empty($json) ? $json : ["note"=>"","select"=>"","hide"=>false,"save"=>false];
            $this->passArgument('config',$json);
            $this->includeJs('designer.js');
        }
        
        // Custom Config page
        if (strpos(PAGE, 'ExternalModules/manager/project.php') !== false && $project_id != NULL) {
            $this->includeJs('config.js');
        }
    }
        
    public function redcap_data_entry_form($project_id, $record, $instrument, $event_id) {
        $json = $this->loadJSON($instrument);
        if ( !empty($json) ) {
            $data = REDCap::getData($project_id,'array',$record,$instrument.'_complete',$event_id);
            if ( count($data) != 1 || $data[$record][$event_id][$instrument.'_complete'] == '0' )
                $json['firstLoad'] = true;
            $this->passArgument('config',$json);
            $this->includeJs('dataentry.js');
        }
    }
    
    private function loadJSON($instrument) {
        $json = $this->getProjectSetting('json');
        $json = empty($json) ? null : (array)json_decode($json)->$instrument;
        return $json;
    }
    
    private function initGlobal() {
        $data = array(
            "modulePrefix" => $this->module_prefix,
            "post" => $this->getUrl('saveSettings.php')
        );
        echo "<script>var ".$this->module_global." = ".json_encode($data).";</script>";
    }

    private function passArgument($name, $value) {
        echo "<script>".$this->module_global.".".$name." = ".json_encode($value).";</script>";
    }
    
    private function includeJs($path) {
        echo '<script src="' . $this->getUrl($path) . '"></script>';
    }
}

?>
